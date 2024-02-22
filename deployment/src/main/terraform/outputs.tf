output "main_dashboard_url" {
  description = "Public URL for the external application"
  value       = "https://${aws_route53_record.public_load_balancer_record.name}/application"
}

output "cloudwatch_dashboard_url" {
  description = "Public URL for the CloudWatch dashboard"
  value       = module.monitoring.cloudwatch_dashboard_url
}

output "hackathon_contestants" {
  value = module.contestant.hackathon_contestants
}
