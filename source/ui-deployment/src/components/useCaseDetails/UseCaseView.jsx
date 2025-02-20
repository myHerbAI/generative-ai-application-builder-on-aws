// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppLayout, Button, Container, ContentLayout, Header, SpaceBetween, Tabs } from '@cloudscape-design/components';

import { Breadcrumbs, GeneralConfig, PageHeader, ModelDetails, KnowledgeBaseDetails } from './common-components';
import { PromptDetails } from './PromptDetails';
import { AgentDetails } from './AgentDetails';
import { Navigation, InfoLink, Notifications } from '../commons/common-components';
import { appLayoutAriaLabels } from '../../i18n-strings';
import { ToolsContent } from './tools-content';
import HomeContext from '../../contexts/home.context';
import { parseStackName } from '../commons/table-config';
import { DeleteDeploymentModal, onDeleteConfirm } from '../commons/delete-modal';
import {
    CFN_STACK_STATUS_INDICATOR,
    DEPLOYMENT_ACTIONS,
    USECASE_TYPE_ROUTE,
    USECASE_TYPES
} from '../../utils/constants';
import { statusIndicatorTypeSelector } from '../dashboard/deployments';

const Model = ({ loadHelpPanelContent }) => (
    <Container
        header={
            <Header
                variant="h2"
                info={
                    <InfoLink
                        onFollow={() => loadHelpPanelContent(1)}
                        ariaLabel={'Information about deployment model.'}
                    />
                }
            >
                Model
            </Header>
        }
    >
        <ModelDetails isInProgress={true} />
    </Container>
);

const KnowledgeBase = ({ loadHelpPanelContent }) => (
    <Container
        header={
            <Header
                variant="h2"
                info={
                    <InfoLink
                        onFollow={() => loadHelpPanelContent(1)}
                        ariaLabel={'Information about deployment knowledge base.'}
                    />
                }
            >
                Knowledge base
            </Header>
        }
    >
        <KnowledgeBaseDetails isInProgress={true} />
    </Container>
);

const Prompt = ({ loadHelpPanelContent, selectedDeployment }) => (
    <Container
        header={
            <Header
                variant="h2"
                info={
                    <InfoLink
                        onFollow={() => loadHelpPanelContent(1)}
                        ariaLabel={'Information about deployment prompt.'}
                    />
                }
            >
                Prompt
            </Header>
        }
    >
        <PromptDetails selectedDeployment={selectedDeployment} />
    </Container>
);

const Agent = ({ loadHelpPanelContent }) => (
    <Container
        header={
            <Header
                variant="h2"
                info={
                    <InfoLink
                        onFollow={() => loadHelpPanelContent(1)}
                        ariaLabel={'Information about deployment agent.'}
                    />
                }
            >
                Agent
            </Header>
        }
    >
        <AgentDetails />
    </Container>
);

export default function UseCaseView() {
    const {
        state: { selectedDeployment },
        dispatch: homeDispatch
    } = useContext(HomeContext);
    const navigate = useNavigate();

    const appLayout = createRef();
    const [toolsOpen, setToolsOpen] = useState(false);
    const [, setToolsIndex] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigateDestination =
        USECASE_TYPE_ROUTE[selectedDeployment.UseCaseType?.toUpperCase()] ?? USECASE_TYPE_ROUTE.TEXT;

    const onDeleteInit = () => setShowDeleteModal(true);
    const onDeleteDiscard = () => setShowDeleteModal(false);

    function loadHelpPanelContent(index) {
        setToolsIndex(index);
        setToolsOpen(true);
        appLayout.current?.focusToolsClose();
    }

    let tabs = [
        {
            label: 'Model',
            id: 'model',
            content: <Model loadHelpPanelContent={loadHelpPanelContent} />,
            key: 'model'
        },
        {
            label: 'Knowledge base',
            id: 'knowledgeBase',
            content: <KnowledgeBase loadHelpPanelContent={loadHelpPanelContent} />,
            key: 'knowledgeBase'
        },
        {
            label: 'Prompt',
            id: 'prompt',
            content: <Prompt loadHelpPanelContent={loadHelpPanelContent} selectedDeployment={selectedDeployment} />,
            key: 'prompt'
        }
    ];

    if (selectedDeployment.UseCaseType === USECASE_TYPES.AGENT) {
        tabs = [
            {
                label: 'Agent',
                id: 'agent',
                content: <Agent loadHelpPanelContent={loadHelpPanelContent} />,
                key: 'agent'
            }
        ];
    }

    const onEditClickAction = () => {
        homeDispatch({
            field: 'selectedDeployment',
            value: selectedDeployment
        });
        homeDispatch({
            field: 'deploymentAction',
            value: DEPLOYMENT_ACTIONS.EDIT
        });
        navigate(navigateDestination);
    };

    const onCloneClickAction = () => {
        homeDispatch({
            field: 'selectedDeployment',
            value: selectedDeployment
        });
        homeDispatch({
            field: 'deploymentAction',
            value: DEPLOYMENT_ACTIONS.CLONE
        });
        navigate(navigateDestination);
    };

    const onFollowNavigationHandler = (event) => {
        navigate(event.detail.href);
    };

    const currentDeploymentStatus = statusIndicatorTypeSelector(selectedDeployment.status);
    const isEditEnabled =
        currentDeploymentStatus === CFN_STACK_STATUS_INDICATOR.SUCCESS ||
        currentDeploymentStatus === CFN_STACK_STATUS_INDICATOR.WARNING;
    const isCloneEnabled =
        currentDeploymentStatus === CFN_STACK_STATUS_INDICATOR.SUCCESS ||
        currentDeploymentStatus === CFN_STACK_STATUS_INDICATOR.WARNING ||
        currentDeploymentStatus === CFN_STACK_STATUS_INDICATOR.STOPPED;

    return (
        <AppLayout
            ref={appLayout}
            content={
                <ContentLayout
                    header={
                        <PageHeader
                            buttonsList={[
                                <Button
                                    onClick={onEditClickAction}
                                    key={'edit-button'}
                                    data-testid="use-case-view-edit-btn"
                                    disabled={!isEditEnabled}
                                >
                                    Edit
                                </Button>,
                                <Button
                                    onClick={onCloneClickAction}
                                    key={'clone-button'}
                                    data-testid="use-case-view-clone-btn"
                                    disabled={!isCloneEnabled}
                                >
                                    Clone
                                </Button>,
                                <Button onClick={onDeleteInit} key={'delete-button'}>
                                    Delete
                                </Button>
                            ]}
                            deploymentId={parseStackName(selectedDeployment.StackId)}
                        />
                    }
                >
                    <SpaceBetween size="l">
                        <GeneralConfig />
                        <Tabs tabs={tabs} ariaLabel="Resource details" />
                    </SpaceBetween>
                    <DeleteDeploymentModal
                        visible={showDeleteModal}
                        onDiscard={onDeleteDiscard}
                        onDelete={onDeleteConfirm}
                        deployment={selectedDeployment}
                    />
                </ContentLayout>
            }
            breadcrumbs={<Breadcrumbs deploymentId={parseStackName(selectedDeployment.StackId)} />}
            navigation={<Navigation onFollowHandler={onFollowNavigationHandler} />}
            tools={<ToolsContent useCaseType={selectedDeployment.UseCaseType} />}
            toolsOpen={toolsOpen}
            onToolsChange={({ detail }) => setToolsOpen(detail.open)}
            ariaLabels={appLayoutAriaLabels}
            notifications={<Notifications />}
            data-testid="use-case-view"
        />
    );
}
