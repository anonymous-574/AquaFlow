variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name used for resource naming."
  type        = string
  default     = "aquaflow"
}

variable "environment" {
  description = "Environment name suffix."
  type        = string
  default     = "hackathon"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC."
  type        = string
  default     = "10.42.0.0/16"
}

variable "az_count" {
  description = "Number of availability zones/subnet pairs to use."
  type        = number
  default     = 2
}

variable "admin_cidr" {
  description = "CIDR allowed to access EC2 tools server ports."
  type        = string
  default     = "0.0.0.0/0"
}

variable "db_username" {
  description = "Master username for PostgreSQL."
  type        = string
  default     = "appuser"
}

variable "db_password" {
  description = "Master password for PostgreSQL."
  type        = string
  sensitive   = true
}

variable "rds_instance_class" {
  description = "RDS instance class (single instance, non-Multi-AZ)."
  type        = string
  default     = "db.t4g.micro"
}

variable "rds_allocated_storage" {
  description = "Initial RDS storage in GB."
  type        = number
  default     = 20
}

variable "redis_node_type" {
  description = "ElastiCache node type for single-node Redis."
  type        = string
  default     = "cache.t4g.micro"
}

variable "tools_instance_type" {
  description = "Instance type for Jenkins/Sonar/Prom/Grafana EC2 host."
  type        = string
  default     = "t3.large"
}

variable "ec2_key_pair_name" {
  description = "Optional key pair name for SSH access to tools EC2."
  type        = string
  default     = null
}

variable "service_discovery_namespace" {
  description = "Private DNS namespace for ECS service-to-service traffic."
  type        = string
  default     = "aquaflow.internal"
}

variable "image_tag" {
  description = "Container image tag to deploy from ECR."
  type        = string
  default     = "latest"
}

variable "microservice_cpu" {
  description = "CPU units for each app Fargate task."
  type        = number
  default     = 256
}

variable "microservice_memory" {
  description = "Memory (MB) for each app Fargate task."
  type        = number
  default     = 512
}

variable "spark_cpu" {
  description = "CPU units for Spark scheduled task."
  type        = number
  default     = 512
}

variable "spark_memory" {
  description = "Memory (MB) for Spark scheduled task."
  type        = number
  default     = 1024
}

variable "spark_schedule_expression" {
  description = "EventBridge schedule for Spark task."
  type        = string
  default     = "cron(0 */12 * * ? *)"
}

variable "jwt_secret_key" {
  description = "JWT secret key for Flask services."
  type        = string
  sensitive   = true
}

variable "internal_service_token" {
  description = "Shared token for internal microservice auth."
  type        = string
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Stripe secret key used by booking service."
  type        = string
  sensitive   = true
}

variable "grafana_admin_password" {
  description = "Grafana admin password on tools EC2."
  type        = string
  sensitive   = true
}

variable "sonarqube_db_password" {
  description = "SonarQube PostgreSQL password on tools EC2."
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Additional resource tags."
  type        = map(string)
  default     = {}
}
