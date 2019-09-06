#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Vidar Tonaas Fauske.
# Distributed under the terms of the Modified BSD License.

import pytest

import datetime

from ..time import TimePicker


def test_example_creation_blank():
    w = TimePicker()
    assert w.value is None

def test_example_creation_value():
    t = datetime.time()
    w = TimePicker(value=t)
    assert w.value is t
