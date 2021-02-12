#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

from __future__ import print_function
from glob import glob
import os.path
from os.path import join as pjoin

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    find_packages,
    combine_commands,
    get_version,
)

from setuptools import setup


HERE = os.path.abspath(os.path.dirname(__file__))

# The name of the project
name = "ipydatetime"

# Get our version
version = get_version(pjoin(HERE, name, "_version.py"))

nb_path = pjoin(HERE, name, "nbextension", "static")
js_path = pjoin(HERE, "ts")
lab_path = pjoin(HERE, "ts", "lab-dist")

# Representative files that should exist after a successful build
jstargets = [pjoin(nb_path, "index.js"), pjoin(js_path, "lib", "plugin.js")]

package_data_spec = {name: ["nbextension/static/*.*js*"]}

data_files_spec = [
    ("share/jupyter/nbextensions/ipydatetime", nb_path, "*.js*"),
    ("share/jupyter/lab/extensions", lab_path, "*.tgz"),
    ("etc/jupyter/nbconfig/notebook.d", HERE, "ipydatetime.json"),
]


if os.environ.get("READTHEDOCS", None) == "True":
    # On RTD, skip JS build to save resources
    import jupyter_packaging.setupbase
    jupyter_packaging.setupbase.skip_npm = True

cmdclass = create_cmdclass(
    "jsdeps", package_data_spec=package_data_spec, data_files_spec=data_files_spec
)
cmdclass["jsdeps"] = combine_commands(
    install_npm(js_path, build_cmd="build:all"), ensure_targets(jstargets)
)


setup_args = dict(
    name=name,
    description="A Jupyter widgets library for time and datetime pickers",
    version=version,
    scripts=glob(pjoin("scripts", "*")),
    cmdclass=cmdclass,
    packages=find_packages(HERE),
    author="Vidar Tonaas Fauske",
    author_email="vidartf@gmail.com",
    url="https://github.com/vidartf/ipydatetime",
    license="BSD",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "Widgets", "IPython"],
    classifiers=[
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Framework :: Jupyter",
    ],
    include_package_data=True,
    install_requires=[
        "ipywidgets>=7.0.0",
        "tzlocal ; python_version<'3'",
    ],
    extras_require={
        "test": [
            "pytest>=3.6",
            "pytest-cov",
            "pytest_check_links",
            "nbval",
            "pytz",
            "coverage",
        ],
        "examples": [
            # Any requirements for the examples to run
            'pytz',
        ],
        "docs": [
            "sphinx>=1.5",
            "recommonmark",
            "sphinx_rtd_theme",
            "nbsphinx>=0.2.13",
            "nbsphinx-link",
            "pypandoc",
            'pytz',
        ],
    },
    entry_points={},
)

if __name__ == "__main__":
    setup(**setup_args)
