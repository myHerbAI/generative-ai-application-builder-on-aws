// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { AttributeEditor, AttributeEditorProps, FormField } from '@cloudscape-design/components';
import {
    AttributeEditorItem,
    ModelParamsEditorDefinition,
    VpcFormFieldProps,
    isSecurityGroupValid,
    vpcToolsContent
} from './helpers';
import InputControl from '../Model/AdvancedModelSettings/InputControl';
import { MAX_NUM_SECURITY_GROUPS } from '../steps-config';
import { InfoLink } from '@/components/commons';

type SecurityGroupItem = AttributeEditorItem;
type SecurityGroupItemsArray = SecurityGroupItem[] | {}[];

const createDefinition = ({ items, setItems, isEditDisabled }: any): ModelParamsEditorDefinition[] => {
    return [
        {
            label: '',
            control: ({ key = '' }, itemIndex: number) => (
                <InputControl
                    prop="key"
                    value={key}
                    index={itemIndex}
                    placeholder="Enter Security Group Id"
                    setItems={setItems}
                    items={items}
                    data-testid="vpc-security-group"
                    disabled={isEditDisabled}
                />
            ),
            errorText: (item: any) => {
                return isSecurityGroupValid(item.key) ? null : 'Must start with "sg-" and be of valid length';
            }
        }
    ];
};

export const SecurityGroupAttrEditor = (props: VpcFormFieldProps) => {
    const [items, setItems] = React.useState<SecurityGroupItemsArray>(props.vpcData.securityGroupIds);

    const handleAddParam = () => {
        if (items.length >= MAX_NUM_SECURITY_GROUPS) {
            return;
        }
        setItems([...items, {}]);
    };

    const handleRemoveParam = (detail: AttributeEditorProps.RemoveButtonClickDetail) => {
        const tmpItems = [...items];
        tmpItems.splice(detail.itemIndex, 1);
        setItems(tmpItems);
    };

    React.useEffect(() => {
        props.onChangeFn({ securityGroupIds: items });
    }, [items]);

    const isEditDisabled = props.disabled ?? false;
    const isRemoveable = !isEditDisabled; // if edit disabled removeable should be false

    return (
        <FormField
            label={
                <span>
                    Security Groups Ids <i>- required</i>{' '}
                </span>
            }
            data-testid="security-groups-field"
            description="The Security Group IDs to be used with the VPC"
            stretch
            info={<InfoLink onFollow={() => props.setHelpPanelContent!(vpcToolsContent.byoVpc)} />}
        >
            <AttributeEditor
                onAddButtonClick={handleAddParam}
                onRemoveButtonClick={({ detail }) => handleRemoveParam(detail)}
                removeButtonText="Remove"
                items={items}
                addButtonText="Add Security Group Id"
                definition={createDefinition({ items, setItems, isEditDisabled })}
                data-testid="security-group-editor"
                isItemRemovable={() => isRemoveable}
                disableAddButton={isEditDisabled}
                additionalInfo={<span>You can add up to {MAX_NUM_SECURITY_GROUPS - items.length} more items.</span>}
            />
        </FormField>
    );
};

export default SecurityGroupAttrEditor;
