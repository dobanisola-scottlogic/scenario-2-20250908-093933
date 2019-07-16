import os
import shutil
from distutils.cmd import Command
from distutils.core import run_setup

from setuptools import setup
from sphinx.setup_command import BuildDoc


class BuildContestantDistCommand(Command):
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        # Build documentation
        shutil.rmtree("docs/source/_autosummary", ignore_errors=True)
        run_setup('setup.py', ['build_sphinx'])
        # Clean dist and re-create dir
        shutil.rmtree("dist", ignore_errors=True)
        shutil.rmtree("temp", ignore_errors=True)
        os.makedirs("dist")
        os.makedirs("temp/python-contestant/lib")
        # Copy packages to dist
        shutil.copytree("bots", "temp/python-contestant/bots", ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
        shutil.copytree("contestant", "temp/python-contestant/contestant",
                        ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
        shutil.copytree("game", "temp/python-contestant/game", ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
        shutil.copytree("util", "temp/python-contestant/util", ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
        shutil.copytree("build/sphinx/html", "temp/python-contestant/docs_html")
        # Copy files to dist
        shutil.copyfile("main.py", "temp/python-contestant/main.py")
        shutil.copyfile("../remote/build/libs/remote-1.0-SNAPSHOT-all.jar",
                        "temp/python-contestant/lib/remote-1.0-SNAPSHOT-all.jar")
        shutil.copyfile("contestant-README.md", "temp/python-contestant/README.md")
        shutil.copyfile("requirements.txt", "temp/python-contestant/requirements.txt")
        shutil.rmtree("build", ignore_errors=True)
        shutil.make_archive("dist/python-contestant", 'zip', 'temp')
        shutil.make_archive("dist/python-contestant", 'tar', 'temp')
        shutil.rmtree("temp", ignore_errors=True)


cmdclass = {'build_sphinx': BuildDoc, 'contestant_repo': BuildContestantDistCommand}

setup(
    name='python-contestant',
    packages=['bots', 'game', 'test', 'util', 'contestant'],
    url='',
    license='',
    author='Scott Logic',
    author_email='',
    description='Scott Logic Hackathon Python Contestant',
    cmdclass=cmdclass
)
