data "aws_ecr_repository" "repos" {
  for_each = local.ecr_repositories
  name     = each.value
}