#!/bin/bash

terraform init -reconfigure -backend-config="address=${ADDRESS}" -backend-config="lock_address=${ADDRESS}/lock" -backend-config="unlock_address=${ADDRESS}/lock" -backend-config="username=moussamarmouch" -backend-config="password=glpat-G_GSoBZUzxjRLvH8jnHG" -backend-config="lock_method=POST" -backend-config="unlock_method=DELETE" -backend-config="retry_wait_min=5"
# export TF_STATE_NAME=default
# terraform init \
#     -backend-config="address=https://gitlab.com/api/v4/projects/${CI_PROJECT_ID}/terraform/state/${STATE_NAME}" \
#     -backend-config="lock_address=https://gitlab.com/api/v4/projects/${CI_PROJECT_ID}/terraform/state/${STATE_NAME}lock" \
#     -backend-config="unlock_address=https://gitlab.com/api/v4/projects/53870593/terraform/state/$TF_STATE_NAME/lock" \
#     -backend-config="username=moussamarmouch" \
#     -backend-config="password=$GITLAB_ACCESS_TOKEN" \
#     -backend-config="lock_method=POST" \
#     -backend-config="unlock_method=DELETE" \
#     -backend-config="retry_wait_min=5"