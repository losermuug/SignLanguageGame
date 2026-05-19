This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ASL model backend

The browser extracts MediaPipe hand and pose landmarks from the webcam, sends
156 landmark features to `POST /api/predict`, and that route runs
`backend/asl_model/predict.py`. The backend uses the TFLite landmark model at
`models/asl/model.tflite` with `models/asl/labels.txt`.

Install Python inference dependencies in a Python 3.11 virtual environment:

```bash
/opt/homebrew/bin/python3.11 -m venv .venv
.venv/bin/python -m pip install -r backend/requirements.txt
```

Use the local TFLite model:

```bash
cp /Users/muugii/Downloads/model.tflite models/asl/model.tflite
```

Or download the Kaggle kernel output:

```bash
python3 -m pip install kaggle
mkdir -p ~/.kaggle
# put your kaggle.json token in ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json
./scripts/download-kaggle-model.sh models/asl
```

If the downloaded model uses a custom label order, replace
`models/asl/labels.txt` with one label per output index. You can override paths
with `ASL_MODEL_PATH`, `ASL_LABELS_PATH`, and `ASL_PYTHON_BIN`.

For local development, run Next with the virtualenv Python so `/api/predict`
can import TensorFlow:

```bash
ASL_PYTHON_BIN=.venv/bin/python npm run dev
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
