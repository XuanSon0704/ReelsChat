provider "aws" {
  region = "ap-southeast-1"
}

resource "aws_ecr_repository" "backend_repo" {
  name                 = "reels-chat/backend"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "frontend_repo" {
  name                 = "reels-chat/frontend"
  image_tag_mutability = "MUTABLE"
}

resource "aws_s3_bucket" "media_bucket" {
  bucket = "my-reelschat-only-307204"
}

resource "aws_iam_user" "jenkins_user" {
  name = "jenkins-ci-cd-user"
}


resource "aws_iam_policy" "jenkins_policy" {
  name = "JenkinsCICDPolicy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["ecr:*"]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = ["s3:*"]
        Resource = "${aws_s3_bucket.media_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "jenkins_attach" {
  user       = aws_iam_user.jenkins_user.name
  policy_arn = aws_iam_policy.jenkins_policy.arn
}


output "backend_ecr_repo_url" {
  value = aws_ecr_repository.backend_repo.repository_url
}

output "frontend_ecr_repo_url" {
  value = aws_ecr_repository.frontend_repo.repository_url
}
