# Create an SSM document to populate the Cloud9 environments with contestant files from the S3 buckets
# The SSM document defines the scripts to be executed on the Cloud9-managed EC2 instances
resource "aws_ssm_document" "s3_cloud9_sync_command" {
  name            = "${var.workspace}-s3-cloud9-sync-command"
  document_type   = "Command"
  document_format = "JSON"

  content = jsonencode({
    "schemaVersion" : "2.2",
    "description" : "Sync files from S3 to Cloud9",
    "mainSteps" : [
      {
        "action" : "aws:runShellScript",
        "name" : "runShellScript",
        "inputs" : {
          "runCommand" : [
            "aws s3 sync s3://${aws_s3_bucket.python_contestant_bucket.bucket} /home/ec2-user/environment",
            "aws s3 sync s3://${aws_s3_bucket.java_contestant_bucket.bucket} /home/ec2-user/environment",
          ]
        }
      }
    ]
  })
}

# Associate the S3Cloud9SyncCommand SSM document with Cloud9-managed EC2 instances to execute the commands on those instances
resource "aws_ssm_association" "execute_s3_cloud9_sync_command" {
  name = aws_ssm_document.s3_cloud9_sync_command.name

  targets {
    key    = "InstanceIds"
    values = [data.aws_instance.cloud9_ec2_instance.id]
  }
}
