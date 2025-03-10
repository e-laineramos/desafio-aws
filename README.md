# API with AWS CDK, API Gateway, Lambda, and DynamoDB

This project is an API that communicates with an AWS Lambda function and interacts with a DynamoDB database. The infrastructure is built using AWS CDK (Cloud Development Kit) with TypeScript. The API is exposed through Amazon API Gateway, which integrates with the Lambda function to process requests and interact with DynamoDB.

# Overview

The project architecture consists of the following AWS services:

* `API Gateway:` Exposes HTTP endpoints to access the API.
* `Lambda:` Serverless function that processes requests and interacts with DynamoDB.
* `DynamoDB:` NoSQL database to store and retrieve data.
* `AWS CDK:` Infrastructure-as-code tool to provision and manage AWS resources.

## Prerequisites

Before getting started, ensure you have the following installed:

* `Node.js:` (v14 or higher)
* `AWS CLI:` configured with your AWS account credentials.
* `AWS CDK:` installed globally (npm install -g aws-cdk).
