#!/usr/bin/env python
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0


# list of operation names as constants
COPY_TEMPLATE = "COPY_TEMPLATE"
COPY_SAMPLE_DOCUMENTS = "COPY_SAMPLE_DOCUMENTS"
CW_LOG_RETENTION = "CW_LOG_RETENTION"
GEN_UUID = "GEN_UUID"
ANONYMOUS_METRIC = "ANONYMOUS_METRIC"
COPY_MODEL_INFO = "COPY_MODEL_INFO"
WEBCONFIG = "WEBCONFIG"
COPY_WEB_UI = "COPY_WEB_UI"
UPDATE_BUCKET_POLICY = "UPDATE_BUCKET_POLICY"
USE_CASE_POLICY = "USE_CASE_POLICY"
ADMIN_POLICY = "ADMIN_POLICY"
DELETE_RESOURCE_ASSOCIATIONS = "DELETE_RESOURCE_ASSOCIATIONS"
GET_COMPATIBLE_AZS = "GET_COMPATIBLE_AZS"
GEN_DOMAIN_PREFIX = "GEN_DOMAIN_PREFIX"
GET_MODEL_RESOURCE_ARNS = "GET_MODEL_RESOURCE_ARNS"

# additional constants
RESOURCE_PROPERTIES = "ResourceProperties"
PHYSICAL_RESOURCE_ID = "PhysicalResourceId"
RESOURCE = "Resource"

# status constants
SUCCESS = "SUCCESS"
FAILED = "FAILED"

# S3 copy constants
SOURCE_BUCKET_NAME = "SOURCE_BUCKET_NAME"
SOURCE_PREFIX = "SOURCE_PREFIX"
LOGGING_BUCKET_NAME = "LOGGING_BUCKET_NAME"

# temporary fs provided by the lambda environment
TMP = "/tmp"  # NOSONAR (python:S5443) using lambda's fs storage /tmp # nosec B108
