# Create AWS VPC and subnets
module "tracktech-vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "-1"
  cidr = "10.0.0.0/16"

  azs              = ["us-east-1a", "us-east-1b"]
  public_subnets   = ["10.0.1.0/24", "10.0.10.0/24"]
  private_subnets  = ["10.0.2.0/24", "10.0.20.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}
