/*
Copyright (C) 2016-2020 Kano Computing Ltd.
License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
*/
# Variables
variable "fqdn" {
  description = "The fully-qualified domain name of the resulting S3 website."
  default     = "code-docs.kano.me"
}

variable "domain" {
  description = "The domain name / ."
  default     = "kano.me"
}