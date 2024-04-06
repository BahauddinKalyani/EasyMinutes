import subprocess
import sys

# Get a list of installed packages
installed_packages = subprocess.check_output([sys.executable, '-m', 'pip', 'list']).decode().split('\n')[2:]

# Uninstall each package
for package in installed_packages:
    if package:
        package_name = package.split()[0]
        subprocess.call([sys.executable, '-m', 'pip', 'uninstall', '-y', package_name])
