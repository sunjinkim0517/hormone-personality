#!/bin/bash
# Railway 배포 후 실행할 스크립트

echo "Running database migrations..."
npm run db:push

echo "Database setup complete!"
