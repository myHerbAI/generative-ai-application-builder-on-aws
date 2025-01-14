// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AuthResponse, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { getPolicyDocument } from './utils/get-policy';

/**
 * Cognito JWT verifier to validate incoming APIGateway websocket authorization request.
 * The CognitoJwtVerifier caches the JWKS file in memory and persists while the lambda is live.
 */
export const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID!,
    tokenUse: 'access',
    clientId: process.env.CLIENT_ID!
});

/**
 * Lambda function to validate incoming APIGateway websocket authorization request.
 * The authorization token is expected to be in the 'Authorization' header.
 * It is expected to be a JWT ID token generted by AWS Cognito, and will be validated using the
 * `aws-jwt-verify` library.
 *
 * The function will return a policy with the effect 'Allow' if the token is valid, and 'Deny' otherwise.
 *
 * @param event Request authorization event received from APIGateway websocket api
 * @param context Lambda event context
 * @returns Object containing `principalId`, `policyDocument` and optionally `context` and `usageIdentifierKey`
 */
export const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<AuthResponse> => {
    try {
        const encodedToken = event.headers?.Authorization;
        if (!encodedToken) {
            throw new Error('Authorization header value is missing');
        }

        const decodedTokenPayload = await jwtVerifier.verify(encodedToken, {
            clientId: process.env.CLIENT_ID!
        });

        return getPolicyDocument(decodedTokenPayload);
    } catch (error: any) {
        console.error(error.message);
        // apigateway needs this exact error so it returns a 401 response instead of a 500
        throw new Error('Unauthorized');
    }
};
