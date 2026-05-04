output "alb_dns_name" {
  description = "Public ALB DNS for frontend and /api routing."
  value       = aws_lb.app.dns_name
}

output "tools_server_public_ip" {
  description = "Public IP of Jenkins/Sonar/Prometheus/Grafana tools EC2."
  value       = aws_eip.tools.public_ip
}

output "rds_endpoint" {
  description = "PostgreSQL endpoint."
  value       = aws_db_instance.postgres.address
}

output "redis_endpoint" {
  description = "Redis endpoint."
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "ecr_repository_urls" {
  description = "ECR repository URLs for all app images."
  value = {
    for name, repo in aws_ecr_repository.repos :
    name => repo.repository_url
  }
}

output "spark_schedule_expression" {
  description = "Current EventBridge schedule for Spark."
  value       = aws_cloudwatch_event_rule.spark_schedule.schedule_expression
}

output "ecs_cluster_name" {
  description = "ECS cluster name."
  value       = aws_ecs_cluster.main.name
}

output "private_subnet_ids" {
  description = "Private subnet IDs used by ECS tasks."
  value       = [for subnet in aws_subnet.private : subnet.id]
}

output "ecs_security_group_id" {
  description = "Security group ID attached to ECS tasks."
  value       = aws_security_group.ecs_tasks.id
}

output "db_seeder_task_definition_arn" {
  description = "Task definition ARN for the one-off DB seed task."
  value       = aws_ecs_task_definition.db_seeder.arn
}

output "spark_task_definition_arn" {
  description = "Task definition ARN for the one-off Spark task."
  value       = aws_ecs_task_definition.spark.arn
}
