locals {
  name_prefix = "${var.project_name}-${var.environment}"

  public_subnet_cidrs  = [for i in range(var.az_count) : cidrsubnet(var.vpc_cidr, 4, i)]
  private_subnet_cidrs = [for i in range(var.az_count) : cidrsubnet(var.vpc_cidr, 4, i + var.az_count)]

  ecr_repositories = toset([
    "frontend",
    "api_gateway",
    "db_seeder",
    "auth_service",
    "supplier_service",
    "booking_service",
    "gamification_service",
    "iot_analytics_service",
    "spark_job",
  ])

  database_names = toset([
    "auth_db",
    "supplier_db",
    "booking_db",
    "gamification_db",
    "iot_db",
  ])

  backend_services = {
    auth_service = {
      repository_name  = "auth_service"
      database_env_var = "AUTH_DATABASE_URL"
      database_name    = "auth_db"
      extra_env        = {}
    }
    supplier_service = {
      repository_name  = "supplier_service"
      database_env_var = "SUPPLIER_DATABASE_URL"
      database_name    = "supplier_db"
      extra_env = {
        AUTH_SERVICE_URL    = "http://auth_service.${var.service_discovery_namespace}:5000"
        BOOKING_SERVICE_URL = "http://booking_service.${var.service_discovery_namespace}:5000"
      }
    }
    booking_service = {
      repository_name  = "booking_service"
      database_env_var = "BOOKING_DATABASE_URL"
      database_name    = "booking_db"
      extra_env = {
        AUTH_SERVICE_URL     = "http://auth_service.${var.service_discovery_namespace}:5000"
        SUPPLIER_SERVICE_URL = "http://supplier_service.${var.service_discovery_namespace}:5000"
      }
    }
    gamification_service = {
      repository_name  = "gamification_service"
      database_env_var = "GAMIFICATION_DATABASE_URL"
      database_name    = "gamification_db"
      extra_env = {
        AUTH_SERVICE_URL = "http://auth_service.${var.service_discovery_namespace}:5000"
      }
    }
    iot_analytics_service = {
      repository_name  = "iot_analytics_service"
      database_env_var = "IOT_DATABASE_URL"
      database_name    = "iot_db"
      extra_env = {
        AUTH_SERVICE_URL         = "http://auth_service.${var.service_discovery_namespace}:5000"
        BOOKING_SERVICE_URL      = "http://booking_service.${var.service_discovery_namespace}:5000"
        GAMIFICATION_SERVICE_URL = "http://gamification_service.${var.service_discovery_namespace}:5000"
        SUPPLIER_SERVICE_URL     = "http://supplier_service.${var.service_discovery_namespace}:5000"
      }
    }
  }

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.tags
  )
}
