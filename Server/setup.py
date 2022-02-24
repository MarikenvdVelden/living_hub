#!/usr/bin/env python

from distutils.core import setup

setup(
    name="livingHub",
    version="0.01",
    description="LivingHub Server",
    author="Farzam Fanitabasi",
    include_package_data=True,
    zip_safe=False,
    keywords=["API", "text"],
    classifiers=[
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: MIT License",
        "Topic :: Text Processing",
    ],
    install_requires=[
        "Flask",
        "Flask-HTTPAuth",
        "flask-cors",
        "elasticsearch",
        "bcrypt",
        "peewee",
        "itsdangerous",
    ],
    extras_require={
        'dev': [
            'nose',
            'codecov',
        ]
    },
)
