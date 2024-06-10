# Create AWS ECS cluster and enable insights
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "ecs_cluster"

# CloudWatch automatically collects data on containers
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

data "aws_caller_identity" "tracktech-current" {}


data "aws_iam_role" "ecs_task_execution_role" {
  name = "labrole"
}

# Fetch gitlab credentials arn from secrets manager
data "aws_secretsmanager_secret" "tracktech-secret-arn" {
 arn = "${aws_secretsmanager_secret.tracktech-secretsmanager-gitlab-credentials9.arn}"
}

#change arn 
# Fetch gitlab credentials arn from secrets manager
# data "aws_secretsmanager_secret" "tracktech-secret-arn" {
#   arn = "arn:aws:secretsmanager:us-east-1:630256519096:secret:tracktech-secretsmanager-gitlab-credentials2-oGOmDc"
# }

################################################# BACKEND #################################################################

# AWS SERVICE BACKEND
# All the backend services have their own container with dedicated ports
resource "aws_ecs_service" "ecs_service_back" {
  name            = "tracktech-service-back"
  cluster         = aws_ecs_cluster.ecs_cluster.name
  task_definition = aws_ecs_task_definition.ecs_task_definition_back.arn
  desired_count   = 1
  launch_type     = "FARGATE"

# Subnet and security group for the backend
  network_configuration {
    subnets          = module.tracktech-vpc.public_subnets
    security_groups  = [aws_security_group.tracktech-ecs-sg.id]
    assign_public_ip = true
  }
  # we put a depends on here so we are sure that these things are made first and than the service of the backend
  depends_on = [aws_ecs_cluster.ecs_cluster, aws_ecs_task_definition.ecs_task_definition_back, aws_security_group.tracktech-ecs-sg, null_resource.wait_before_creating_service]

}

# The task defenition where the containers will be running in
resource "aws_ecs_task_definition" "ecs_task_definition_back" {
  family                   = "tracktech-ecs-service"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 6144
  cpu                      = 2048
  execution_role_arn       = data.aws_iam_role.ecs_task_execution_role.arn

# specifications for the container and variables
  container_definitions = jsonencode([
    {
      "name": "tracktech-container-backend",
      "image": "registry.gitlab.com/tester6133705/tracktech:backhttps1",
      "repositoryCredentials": {
        "credentialsParameter": "${data.aws_secretsmanager_secret.tracktech-secret-arn.arn}"
      },
      "memory": 2048,
      "cpu": 512,
      "essential": false,
      "portMappings": [
        {
          "containerPort": 6587,
          "hostPort": 6587,
          "protocol": "tcp",
          "name": "back"
        }
      ],
      "environment": [
        { name = "POSTGRES_USER", value = var.aws_db_username },
        { name = "POSTGRES_PASSWORD", value = var.aws_db_password },
        {name = "DATABASE_HOST", value = "tracktech-container-db"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-create-group": "true",
          "awslogs-group": "awslogs-tracktech",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "awslogs-backend"
        }
      }
    },

    {
      "name": "tracktech-container-fastapi",
      "image": "registry.gitlab.com/tester6133705/tracktech:fast",
      "repositoryCredentials": {
        "credentialsParameter": "${data.aws_secretsmanager_secret.tracktech-secret-arn.arn}"
      },
      "memory": 2048,
      "cpu": 512,
      "essential": false,
      "portMappings": [
        {
          "containerPort": 8000,
          "hostPort": 8000,
          "protocol": "tcp",
          "name": "fast"
        }
      ],
      "environment": [
        {name = "api_key_fastapi", value = var.api_key_fastapi},
        {name = "aws_db_password", value = var.aws_db_password},
        {name = "aws_secret_key", value = var.aws_secret_key},
        {name = "aws_access_key", value = var.aws_access_key},
        {name = "aws_db_user", value = var.aws_db_username},
        {name = "aws_token", value = var.aws_token},
        {name = "s3_bucket", value = var.s3_bucket},
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-create-group": "true",
          "awslogs-group": "awslogs-tracktech",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "awslogs-backend"
        }
      }
    },

    {
      "name": "tracktech-container-db",
      "image": "timescale/timescaledb-ha:pg15.5-ts2.13.1-all", 
      "memory": 2048,
      "cpu": 512,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5432,
          "hostPort": 5432,
          "protocol": "tcp",
          "name": "db"
        }
      ],
      "environment": [
        { name = "POSTGRES_USER", value = var.aws_db_username },
        { name = "POSTGRES_PASSWORD", value = var.aws_db_password }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-create-group": "true",
          "awslogs-group": "awslogs-tracktech",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "awslogs-db"
        }
      }
    }
  ])

  depends_on = [aws_ecs_cluster.ecs_cluster, data.aws_caller_identity.tracktech-current]
}

# ------------------------------------------------- WEB ------------------------------------------------------------
# AWS SERVICE FRONTEND
resource "aws_ecs_service" "ecs_service" {
  name            = "tracktech-service"
  cluster         = aws_ecs_cluster.ecs_cluster.name
  task_definition = aws_ecs_task_definition.ecs_task_definition_web.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.tracktech-vpc.public_subnets
    security_groups  = [aws_security_group.tracktech-ecs-sg-web.id]
    assign_public_ip = true
  }
  # load_balancer {
  #   target_group_arn = aws_lb_target_group.tracktech-aws-lb-target-group.arn
  #   container_name   = "tracktech-container-frontend"
  #   container_port   = 80
  # }

  depends_on = [aws_ecs_cluster.ecs_cluster, aws_ecs_task_definition.ecs_task_definition_web, aws_security_group.tracktech-ecs-sg-web, null_resource.wait_before_creating_service]

}
# New task for the frontend
resource "aws_ecs_task_definition" "ecs_task_definition_web" {
  family                   = "tracktech-ecs-service-web"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 2048
  cpu                      = 512
  execution_role_arn       = data.aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      "name": "tracktech-container-frontend",
      "image": "registry.gitlab.com/tester6133705/tracktech:web1",
      "repositoryCredentials": {
        "credentialsParameter": "${data.aws_secretsmanager_secret.tracktech-secret-arn.arn}"
      },
      "memory": 2048,
      "cpu": 512,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { name = "DATABASE_HOST", value = "tracktech-container-db" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-create-group": "true",
          "awslogs-group": "awslogs-tracktech",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "awslogs-frontend"
        }
      }
    }
  ])
}

###############################################################
#               test                                          #
###############################################################

resource "null_resource" "wait_before_creating_service" {
  triggers = {
    wait_before_creating_service = timestamp()
  }

  provisioner "local-exec" {
    command = "sleep 120"  # Wacht 2 minuten (of pas aan zoals nodig)
  }
}



######## NAMESPACE FOR SERVICE DISCOVERY ####################
# resource "aws_service_discovery_private_dns_namespace" "namespace" {
#   name = "example-namespace"
#   vpc  = "vpc-id"  # Replace with your VPC ID
# }