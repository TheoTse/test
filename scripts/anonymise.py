import concurrent.futures
import os
import sys
from pathlib import Path

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "stagekine.config.settings")
django.setup()

import re
import string
from random import choice, randint

from django.db import connection, transaction
from faker import Faker
from stagekine.portfolio.models import ActiviteRealisee, FichierActivite
from stagekine.stage.models import Evaluation, LieuxStage, NoteCritereEvaluation, User
from tqdm import tqdm


def set_password(user_instance):
    user_instance.set_password("motdepasse")


@transaction.atomic
def main():
    fake = Faker("fr")

    for instance in tqdm(LieuxStage.objects.all(), desc="Lieux de stage"):
        instance.emails = "\n".join(
            fake.email() for _ in range(fake.random.randint(0, 5))
        )
        instance.responsables = "\n".join(
            fake.name() for _ in range(fake.random.randint(0, 5))
        )
        instance.telephones = "\n".join(
            fake.phone_number() for _ in range(fake.random.randint(0, 5))
        )
        instance.save()

    for instance in tqdm(Evaluation.objects.all(), desc="Evaluations"):
        instance.note_stage = fake.random.randint(0, instance.session.pond_stage)
        instance.note_superviseur = fake.random.randint(
            0, instance.session.pond_lecteur
        )
        instance.remarques = fake.text()
        instance.preuve_eval.name = fake.file_name()
        instance.rapport_stage.name = fake.file_name()
        instance.fichier_remarques.name = fake.file_name()

        instance.save()

    def gen_username(matched):
        return "".join(
            [
                matched.group(1),
                *fake.random.choices(string.digits, k=fake.random.randint(6, 8)),
            ]
        )

    for instance in tqdm(User.objects.all(), desc="Utilisateurs"):

        if matched := re.match(r"^([eh])([0-9]+)$", instance.username):
            username = gen_username(matched)
            while User.objects.filter(username=username).exists():
                username = gen_username(matched)
        else:
            username = fake.user_name()
            while User.objects.filter(username=username).exists():
                username = fake.user_name()

        instance.username = username
        instance.last_name = fake.last_name()
        instance.first_name = fake.first_name()
        instance.email = f"{instance.last_name}.{instance.first_name}@hers.be"
        instance.save()

    for instance in tqdm(ActiviteRealisee.objects.all(), desc="Activités réalisées"):
        instance.description = fake.text()
        instance.save()

    for instance in tqdm(FichierActivite.objects.all(), desc="Fichiers activités"):
        instance.fichier.name = fake.file_name()
        instance.save()

    for instance in tqdm(
        NoteCritereEvaluation.objects.all(), desc="Notes critères évaluations"
    ):
        instance.note = fake.random.choice(NoteCritereEvaluation.APPRECIATIONS)[0]
        instance.save()

    users = User.objects.all()
    with tqdm(
        total=len(users), desc="Attribue le mdp 'motdepasse' à chaque utilisateur"
    ) as pbar:
        with concurrent.futures.ProcessPoolExecutor() as e:
            for res in e.map(set_password, users):
                pbar.update(1)

    tables = [
        "admin_honeypot_loginattempt",
        "axes_accessattempt",
        "axes_accessfailurelog",
        "axes_accesslog",
        "django_admin_log",
        "wagtailcore_modellogentry",
        "wagtailcore_pagelogentry",
        "django_session",
        "stagekine_cache",
    ]

    with connection.cursor() as cursor:
        for table in tqdm(tables, desc="Vide certaines tables"):
            cursor.execute(f"delete from {table}")


def run():
    main()
