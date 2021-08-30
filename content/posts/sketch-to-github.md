---
title: Sketch to GitHub
date: 2020-06-17
published: true
tags: ['tutorial', 'software', 'sketch']
series: false
cover_image: ./images/sketch.png
canonical_url: false
description: ""
---

**Sketch to GitHub** was a project I created to apply version control to individual Sketch files. This allowed us to handle merge conflicts and prevent file overrides when sharing files between multiple people.

Version control was added through the use of two custom Bash scripts: one for downloading files from a GitHub repository and another for uploading files to the same repository.

## Downloading Sketch Files

This script used a `/sketch` folder inside the repository to rebuild and store updated Sketch files after download. It ran automatically using Git Hooks for `post-merge` and `post-pull`.

The following workflow was performed:

1. Remove all existing `.sketch` files from folder
1. Export each Sketch directory from repository to its own `.zip` file
1. Convert `.zip` file to `.sketch` file
1. Remove leftover `.zip` files

```bash
#!/bin/sh

directory="sketch"
cd $directory/

echo "removing previous sketch files ..."
rm -rf -- *.sketch

echo "exporting new sketch files ..."
for file in *
do
  zip_file="${file%.*}"

  # export sketch directory to zip file
  cd $zip_file/
  zip $zip_file.zip -r .

  # convert zip file to sketch file
  cp $zip_file.zip ../$zip_file.sketch

  # remove files no longer needed
  rm -rf $zip_file.zip
  cd ..
done

echo "done!"
```

## Uploading Sketch Files

This script used a `/sketch` folder inside the repository to prepare Sketch files for version control prior to upload. It would run automatically on unstaged files using a Git Hook for `pre-commit`.

The following workflow was performed:

1. Check for modified `.sketch` files and remove their associated Sketch directory
1. Convert modified `.sketch` file to `.zip` file
1. Export `.zip` file to Sketch directory
1. Remove leftover `.zip` files, images previews, and text previews
1. Prettify `.json` files for better version control

```bash
#!/bin/sh

directory="sketch"
cd $directory/

echo "checking for modified sketch files ..."
for modified_sketch_file in *.sketch
do
  sketch_file=$(basename $modified_sketch_file .sketch)

  # remove associated file directories
  rm -rf -- $sketch_file/

  # convert sketch file to .zip file
  cp $sketch_file.sketch $sketch_file.zip

  # export zip file to Sketch directory
  unzip -o $sketch_file.zip -d $sketch_file/

  # remove files no longer needed
  rm -rf $sketch_file.zip
  rm -rf $sketch_file/previews/
  rm -rf $sketch_file/text-previews/
done

echo "cleaning up json files ..."
for modified_json_file in /*.json
do
  json_file=${modified_json_file/sketch/.}

  # prettify json files
  python3 -m json.tool --sort-keys "$json_file" "$json_file".pretty
  mv "$json_file".pretty "$json_file"
done

echo "done!"
```
