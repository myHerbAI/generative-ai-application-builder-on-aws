// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CROSS_REGION_INFERENCE, INFERENCE_PROFILE, MODEL_PROVIDER_NAME_MAP } from '../../steps-config';
import {
    isValidInteger,
    isValidFloat,
    isValidBoolean,
    validateList,
    validateDictionary,
    isModelParametersValid,
    formatModelNamesList
} from '../helpers';

describe('When validating model parameters', () => {
    describe('It should validate integer strings', () => {
        const mockModelParamIntegerAttribute = (val: string) => {
            return {
                key: 'k',
                value: val,
                type: { label: 'integer', value: 'integer' }
            };
        };

        test('It should return true for valid integer strings', () => {
            expect(isValidInteger(mockModelParamIntegerAttribute('1'))).toBeTruthy();
            expect(isValidInteger(mockModelParamIntegerAttribute('-1'))).toBeTruthy();
            expect(isValidInteger(mockModelParamIntegerAttribute('1.0'))).toBeTruthy();
            expect(isValidInteger(mockModelParamIntegerAttribute('fake-string'))).toBeFalsy();
        });
    });

    describe('It should validate float strings', () => {
        const mockModelParamFloatAttribute = (val: string) => {
            return {
                key: 'k',
                value: val,
                type: { label: 'float', value: 'float' }
            };
        };
        test('It should return true for valid float strings', () => {
            expect(isValidFloat(mockModelParamFloatAttribute('1'))).toBeTruthy();
            expect(isValidFloat(mockModelParamFloatAttribute('-1'))).toBeTruthy();
            expect(isValidFloat(mockModelParamFloatAttribute('1.0'))).toBeTruthy();
            expect(isValidFloat(mockModelParamFloatAttribute('fake-string'))).toBeFalsy();
        });
    });

    describe('It should validate boolean strings', () => {
        const mockModelParamBooleanAttribute = (val: string) => {
            return {
                key: 'k',
                value: val,
                type: { label: 'boolean', value: 'boolean' }
            };
        };
        test('It should return true for valid boolean strings', () => {
            expect(isValidBoolean(mockModelParamBooleanAttribute('true'))).toBeTruthy();
            expect(isValidBoolean(mockModelParamBooleanAttribute('TRUE'))).toBeTruthy();
            expect(isValidBoolean(mockModelParamBooleanAttribute('false'))).toBeTruthy();
            expect(isValidBoolean(mockModelParamBooleanAttribute('yes'))).toBeTruthy();
            expect(isValidBoolean(mockModelParamBooleanAttribute('no'))).toBeTruthy();
            expect(isValidBoolean(mockModelParamBooleanAttribute('No'))).toBeTruthy();
            expect(isValidBoolean(mockModelParamBooleanAttribute('1'))).toBeFalsy();
        });
    });

    describe('It should validate list strings', () => {
        const mockModelParamListAttribute = (val: string) => {
            return {
                key: 'k',
                value: val,
                type: { label: 'list', value: 'list' }
            };
        };
        test('It should return true for valid list strings', () => {
            expect(validateList(mockModelParamListAttribute('["a","b","c"]'))).toBeTruthy();
            expect(validateList(mockModelParamListAttribute('"a","b","c"'))).toBeTruthy();
            expect(validateList(mockModelParamListAttribute('["a","b","1"]'))).toBeTruthy();
            expect(validateList(mockModelParamListAttribute("['a','b']"))).toBeFalsy();
            expect(validateList(mockModelParamListAttribute('["a","b",'))).toBeFalsy();
        });
    });

    describe('It should validate dictionary strings', () => {
        const mockModelParamDictionaryAttribute = (val: string) => {
            return {
                key: 'k',
                value: val,
                type: { label: 'dictionary', value: 'dictionary' }
            };
        };

        test('It should return true for valid dictionary strings', () => {
            expect(validateDictionary(mockModelParamDictionaryAttribute('{"a":"b","c":"d"}'))).toBeTruthy();
            expect(validateDictionary(mockModelParamDictionaryAttribute('{a:"b","c":"d"}'))).toBeFalsy();
        });
    });

    describe('It should validate model parameters', () => {
        test('It should return true for valid model parameters', () => {
            expect(
                isModelParametersValid([
                    {
                        key: 'a',
                        value: '1',
                        type: { label: 'integer', value: 'integer' }
                    },
                    {
                        key: 'b',
                        value: '1.0',
                        type: { label: 'float', value: 'float' }
                    },
                    {
                        key: 'c',
                        value: 'yes',
                        type: { label: 'boolean', value: 'boolean' }
                    },
                    {
                        key: 'd',
                        value: 'fake-string',
                        type: { label: 'string', value: 'string' }
                    },
                    {
                        key: 'e',
                        value: '["a","b"]',
                        type: { label: 'list', value: 'list' }
                    },
                    {
                        key: 'f',
                        value: '{"a":"b","c":"d"}',
                        type: { label: 'dictionary', value: 'dictionary' }
                    }
                ])
            ).toBeTruthy();
        });

        test('It should return false if a model parameter is invalid', () => {
            expect(
                isModelParametersValid([
                    {
                        key: 'a',
                        value: '1',
                        type: { label: 'integer', value: 'integer' }
                    },
                    {
                        key: 'b',
                        value: 'fake-string',
                        type: { label: 'float', value: 'float' }
                    }
                ])
            ).toBeFalsy();
        });
    });
});

describe('formatModelNamesList', () => {
    test('should format Bedrock model names with cross-region inference at the beginning', () => {
        const modelNames = ['ai21.j2-ultra', 'anthropic.claude-v2', INFERENCE_PROFILE, 'amazon.titan-text-express-v1'];

        const result = formatModelNamesList(modelNames, MODEL_PROVIDER_NAME_MAP.Bedrock);

        expect(result[0]).toEqual({
            label: CROSS_REGION_INFERENCE,
            options: [
                {
                    label: 'select inference profile...',
                    value: INFERENCE_PROFILE
                }
            ]
        });

        expect(result).toHaveLength(4);
        expect(result[1]).toMatchObject({
            label: expect.any(String),
            options: expect.arrayContaining([
                expect.objectContaining({
                    label: expect.any(String),
                    value: expect.any(String)
                })
            ])
        });
    });

    test('should handle Bedrock model names without inference profile', () => {
        const modelNames = ['ai21.j2-ultra', 'anthropic.claude-v2'];

        const result = formatModelNamesList(modelNames, MODEL_PROVIDER_NAME_MAP.Bedrock);

        expect(result.some((group) => group.label === CROSS_REGION_INFERENCE)).toBeFalsy();
        expect(result).toHaveLength(2);
    });

    test('should handle non-Bedrock model names', () => {
        const modelNames = ['model1', 'model2', 'model3'];
        const result = formatModelNamesList(modelNames, MODEL_PROVIDER_NAME_MAP.SageMaker);

        expect(result).toEqual([
            { label: 'model1', value: 'model1' },
            { label: 'model2', value: 'model2' },
            { label: 'model3', value: 'model3' }
        ]);
    });

    test('should handle empty model names array', () => {
        const modelNames: string[] = [];

        const bedrockResult = formatModelNamesList(modelNames, MODEL_PROVIDER_NAME_MAP.Bedrock);
        expect(bedrockResult).toEqual([]);

        const nonBedrockResult = formatModelNamesList(modelNames, MODEL_PROVIDER_NAME_MAP.SageMaker);
        expect(nonBedrockResult).toEqual([]);
    });
});
