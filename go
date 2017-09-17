#!/usr/bin/env bash
rm -f cissp.db
sqlite3 cissp.db < cissp.sql
