data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_instance" "tools" {
  ami                    = data.aws_ssm_parameter.al2023_ami.value
  instance_type          = var.tools_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.tools.id]
  key_name               = var.ec2_key_pair_name

  iam_instance_profile        = aws_iam_instance_profile.tools_ec2.name
  associate_public_ip_address = true

  user_data = templatefile("${path.module}/user_data_tools.sh.tftpl", {
    albdns                = aws_lb.app.dns_name
    grafana_password      = var.grafana_admin_password
    sonarqube_db_password = var.sonarqube_db_password
    db_host               = aws_db_instance.postgres.address
    db_user               = var.db_username
    db_password           = var.db_password
  })

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-tools"
  })

  depends_on = [
    aws_db_instance.postgres,
    aws_lb_listener_rule.api_paths,
  ]
}

resource "aws_eip" "tools" {
  domain   = "vpc"
  instance = aws_instance.tools.id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-tools-eip"
  })
}
