# Combined Security Group for ECS Database, Backend, and Web Server
resource "aws_security_group" "tracktech-ecs-sg" {
  name        = "tracktech-ecs-sg"
  description = "Allow traffic for ECS database and backend"
  vpc_id      = module.tracktech-vpc.vpc_id

  # Allow inbound traffic from the load balancer to the Web Server
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    #security_groups = [aws_security_group.tracktech-lb-security-group.id]
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow incoming traffic from the Web Server to the Database
  ingress {
    from_port       = 5432  # Assuming PostgreSQL database, change port accordingly
    to_port         = 5432
    protocol        = "tcp"
    #security_groups = [aws_security_group.tracktech-lb-security-group.id]
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow incoming traffic from the Load Balancer to the Backend
  ingress {
    from_port   = 6587
    to_port     = 6587
    protocol    = "tcp"
    #security_groups = [aws_security_group.tracktech-lb-security-group.id]
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################### WEB SECURITY GROUP ##########################################
resource "aws_security_group" "tracktech-ecs-sg-web" {
  name        = "tracktech-ecs-sg-web"
  description = "Allow traffic for ECS database and backend"
  vpc_id      = module.tracktech-vpc.vpc_id

  # Allow incoming traffic from the Load Balancer to the Backend
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}