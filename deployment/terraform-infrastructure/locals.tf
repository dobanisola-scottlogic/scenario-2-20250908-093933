locals {
  workspace           = lower(terraform.workspace == "default" ? var.project : replace(terraform.workspace, "-", ""))
  server_service_name = "${local.workspace}-server"
  db_name             = local.workspace
}
