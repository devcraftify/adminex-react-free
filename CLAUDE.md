# Project Instructions

- **Never delete the `dist/` folder, or any other folder in this project, without first listing its contents and asking for explicit confirmation.** `dist/` is not just build output here — it may contain a separate git repository or other content that isn't tracked anywhere else. Running `npm run build` does not require deleting `dist/` first; Vite overwrites it safely on its own.
- More generally: before running any destructive command (`rm`, `rm -rf`, force-overwrite, etc.) anywhere in this project, check what's actually there first and confirm with the user. Do not assume a folder only contains regenerable build artifacts just because of its name.
