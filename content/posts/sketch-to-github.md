---
title: Using Sketch with Git
date: 2020-06-16
published: true
tags: ['sketch', 'software', 'tutorial']
series: false
cover_image: ./images/sketch.png
canonical_url: false
description: ""
---

**Using Sketch with Git** was developed to track changes, handle merge conflicts, and prevent file overrides when sharing Sketch files between multiple people.

This was accomplished through two scripts: one for downloading and another for uploading Sketch files within a single GitHub repository.

**Downloading Sketch Files from GitHub**

This script used a `/sketch` folder inside the repository to build and store Sketch files after download. It would run automatically using Git Hooks for `post-merge` and `post-pull`.

The following workflow was performed:

1. Remove all existing `.sketch` files
1. Export each Sketch directory to a `.zip` file
1. Copy `.zip` file to `.sketch` file
1. Remove `.zip` files

```bash
#!/bin/sh

directory="sketch"
cd $directory/

echo "removing sketch files ..."
rm -rf -- *.sketch

echo "rebuilding sketch files ..."
for file in *
do
  zip_file="${file%.*}"

  # export sketch directory to .zip
  cd $zip_file/
  zip $zip_file.zip -r .

  # copy .zip to .sketch
  cp $zip_file.zip ../$zip_file.sketch

  # remove files no longer needed
  rm -rf $zip_file.zip
  cd ..
done
echo "done!"
```

**Uploading Sketch Files to GitHub**

This script used a `/sketch` folder inside git repository to build and store Sketch files after download. It would run automatically on unstaged files using a Git Hook for `pre-commit`.

The following workflow was performed:

1. Removes modified Sketch directories
1. Copies `.sketch` file to `.zip` file
1. Exports `.zip` file to Sketch directory
1. Removes `.zip` file, preview images, and preview text
1. Prettifies `.json` files in each directory

```bash
#!/bin/sh

directory="sketch"
cd $directory/

echo "checking for modified files ..."
for modified_sketch_file in *.sketch
do
  sketch_file=$(basename $modified_sketch_file .sketch)

  # remove existing file directory
  rm -rf -- $sketch_file/

  # copy .sketch to .zip
  cp $sketch_file.sketch $sketch_file.zip

  # unzip file to directory
  unzip -o $sketch_file.zip -d $sketch_file/

  # remove files no longer needed
  rm -rf $sketch_file.zip
  rm -rf $sketch_file/previews/
  rm -rf $sketch_file/text-previews/
done

echo "cleaning json files ..."
for modified_json_file in /*.json
do
  json_file=${modified_json_file/sketch/.}

  # prettify json files
  python3 -m json.tool --sort-keys "$json_file" "$json_file".pretty
  mv "$json_file".pretty "$json_file"
done
echo "done!"
```
