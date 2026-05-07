import joblib
import json
import numpy as np

pkl_path = 'public/Gesture-Recognition/models/gesture_clf.pkl'
print(f"Loading {pkl_path}...")
clf = joblib.load(pkl_path)

# Extract GaussianNB params
params = {
    'classes': clf.classes_.tolist(),
    'class_prior': clf.class_prior_.tolist(),
    'theta': clf.theta_.tolist(),
}

# In older sklearn versions, variance is stored in `sigma_`, in newer versions it's `var_`
if hasattr(clf, 'var_'):
    params['var'] = clf.var_.tolist()
elif hasattr(clf, 'sigma_'):
    params['var'] = clf.sigma_.tolist()
else:
    print("Could not find variance attribute!")
    exit(1)

out_path = 'public/gesture_clf_params.json'
with open(out_path, 'w') as f:
    json.dump(params, f)

print(f"Exported params to {out_path}!")
