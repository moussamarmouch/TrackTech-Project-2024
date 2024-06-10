#Generate the secrets manager for our team
resource "aws_secretsmanager_secret" "tracktech-secretsmanager-gitlab-credentials9" {
  name = "tracktech-secretsmanager-gitlab-credentials9"

  lifecycle {
    prevent_destroy = false
  }
}

# Put the gitlab credentials in the secrets manager
resource "aws_secretsmanager_secret_version" "tracktech-secretsmanager-gitlab-credentials9" {
  secret_id     = aws_secretsmanager_secret.tracktech-secretsmanager-gitlab-credentials9.id
  secret_string = jsonencode(
    {
      "username": var.gitlab_deploy_token_username,
      "password": var.gitlab_deploy_token_token
    }
  )

  lifecycle {
    prevent_destroy = false
  }
}

# Allow the ECS task to read the secrets manager
data "aws_iam_policy_document" "tracktech-data-policy-document" {
  statement {
    sid    = "EnableAnotherAWSAccountToReadTheSecret"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.tracktech-current.account_id}:role/LabRole"]
    }

    actions   = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
    resources = ["*"]
  }

  depends_on = [ data.aws_caller_identity.tracktech-current ]
}

# Allow the secrets manager to be read by the ECS task
resource "aws_secretsmanager_secret_policy" "tracktech-secret-policy" {
  secret_arn = aws_secretsmanager_secret.tracktech-secretsmanager-gitlab-credentials9.arn
  policy     = data.aws_iam_policy_document.tracktech-data-policy-document.json

  depends_on = [ data.aws_iam_policy_document.tracktech-data-policy-document, aws_secretsmanager_secret.tracktech-secretsmanager-gitlab-credentials9 ]
}
