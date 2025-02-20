#!/usr/bin/env python
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import zipfile

import botocore
import pytest
from operations.operation_types import RESOURCE_PROPERTIES, SOURCE_BUCKET_NAME, SOURCE_PREFIX
from operations.shared import get_zip_archive
from test.fixtures.copy_web_ui_events import lambda_event, web_ui_copy_setup


def test_get_zip_archive(web_ui_copy_setup):
    lambda_event, s3_resource, _ = web_ui_copy_setup

    source_bucket_name = lambda_event[RESOURCE_PROPERTIES][SOURCE_BUCKET_NAME]
    source_prefix = lambda_event[RESOURCE_PROPERTIES][SOURCE_PREFIX]

    archive = get_zip_archive(s3_resource, source_bucket_name, source_prefix)
    assert len(archive.filelist) > 0


def test_get_archive_errors_for_wrong_prefix(web_ui_copy_setup):
    lambda_event, s3_resource, _ = web_ui_copy_setup

    source_bucket_name = lambda_event[RESOURCE_PROPERTIES][SOURCE_BUCKET_NAME]
    source_prefix = "does_not_exist.zip"

    with pytest.raises(botocore.exceptions.ClientError):
        get_zip_archive(s3_resource, source_bucket_name, source_prefix)


def test_with_bad_zip_file(tmp_path, web_ui_copy_setup):
    lambda_event, s3_resource, _ = web_ui_copy_setup

    source_bucket_name = lambda_event[RESOURCE_PROPERTIES][SOURCE_BUCKET_NAME]
    source_prefix = lambda_event[RESOURCE_PROPERTIES][SOURCE_PREFIX]

    tmp_dir = tmp_path / "bad_zip"
    tmp_dir.mkdir()
    bad_zip_file = tmp_dir / "fake_bad_zip.zip"
    bad_zip_file.write_text("This is a fake bad zip file")
    assert len(list(tmp_path.iterdir())) == 1
    s3_resource.meta.client.upload_file(str(bad_zip_file), source_bucket_name, f"{source_prefix}")

    with pytest.raises(zipfile.error):
        get_zip_archive(s3_resource, source_bucket_name, source_prefix)
