provider "aws" {
  region = "eu-west-2"
}

#####################################################################################

resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "aafnotes-vpc"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.vpc.id
}

#####################################################################################

resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "aafnotes-rt"
  }
}

resource "aws_subnet" "app-subnet" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.1.0/24"

  availability_zone = "eu-west-2a"

  tags = {
    Name = "app-subnet"
  }
}

resource "aws_route_table_association" "route_assoc" {
  subnet_id      = aws_subnet.app-subnet.id
  route_table_id = aws_route_table.rt.id
}

#####################################################################################

resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic"
  description = "Allow Web inbound traffic"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    description = "HTTP"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_web"
  }
}

#####################################################################################


resource "aws_network_interface" "nic" {
  subnet_id       = aws_subnet.app-subnet.id
  private_ips     = ["10.0.1.80"]
  security_groups = [aws_security_group.allow_web.id]
}

resource "aws_eip" "eip" {
  vpc                       = true
  network_interface         = aws_network_interface.nic.id
  associate_with_private_ip = "10.0.1.80"
  depends_on                = [aws_internet_gateway.gw]
}

#####################################################################################


resource "aws_instance" "notes-web" {
  ami               = "ami-0d93d81bb4899d4cf"
  instance_type     = "t2.micro"
  availability_zone = "eu-west-2a"
  key_name          = "test-key"


  network_interface {
    network_interface_id = aws_network_interface.nic.id
    device_index         = 0
  }


  user_data = <<-EOF
                 #!/bin/bash
                 sudo apt update -y
                 sudo apt install -y npm nodejs
                 git clone https://github.com/rafri/sds2.git
                 cd sds2/01-notebook/
                 npm install
                 npm audit fix
                 npm start
                 EOF
  tags = {
    Name = "notes-debian-box"
  }
}



output "server_private_ip" {
  value = aws_instance.notes-web.private_ip

}

output "server_id" {
  value = aws_instance.notes-web.id
}
