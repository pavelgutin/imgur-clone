provider "aws"{
    region = "us-east-1"
}

resource "aws_s3_bucket" "pavelbgutin_imgur_image_bucket" {
    bucket = "dev-pavelbgutin-imgur-clone-bucket"

    cors_rule{
        allowed_headers = ["*"]
        allowed_methods = ["PUT", "POST"]
        allowed_origins = ["*"]
        expose_headers = ["x-amz-server-side-encryption", "x-amz-request-id", "x-amz-id-2"]
        max_age_seconds = 3000
    }
    
    tags = {
        Name = "Dev Imgur Clone Bucket"
        Environment = "Dev"
    }    
  
}
