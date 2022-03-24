import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Localized } from 'i18n';
import { useRouteMatch } from 'react-router-dom';
import { Modal, Checkbox, Button, SearchBox, notification, Alert, Status } from '@tencent/tea-component';
import { useRealtimeGetApkInfoLazyQuery } from 'generated/graphql';

type AddProjectType = {
    isShow: boolean
    setIsShowAddDialog: Dispatch<SetStateAction<boolean>>
    selectApp: Dispatch<React.SetStateAction<any[]>>
    // refreshFn:()=>void
}
interface ProjectMatch {
    projectId: string
}

export const SelectAppModal: React.FC<AddProjectType> = (props) => {
    const pageParam = useRouteMatch<ProjectMatch>().params;
    const projectId = pageParam.projectId;
    const teamId = 'team_items;1';
    const [getOption, optionsHook] = useRealtimeGetApkInfoLazyQuery();

    const [options, setOptions] = useState<any[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const [selectValue, setSelectValue] = useState<any>('');


    useEffect(() => {
        let result: any[] = [];
        optionsHook.data?.realtimeGetApkInfo?.map((value, key) => {
            result.push({ text: value?.appName, value: value?.packageName });
        })
        setOptions(result);
    }, [optionsHook.data])

    useEffect(() => {
        if (props.isShow) {
            setOptions([]);
            getOption({ variables: { projectId: projectId } })
        }
    }, [props.isShow])


    return <> <Modal size='l' visible={props.isShow} caption={<Localized id='compliance-selectApp'></Localized>}
        onClose={() => { props.setIsShowAddDialog(false) }}>
        <Modal.Body>
            <div>
                <Alert>请选择被测APP，最多勾选20个。</Alert>
                <SearchBox
                    value={selectValue}
                    onChange={(value) => { setSelectValue(value) }}
                />
            </div>
            <div style={{ maxHeight: 400, overflow: 'auto', width: '100%', marginTop: 20 }}>
                {
                    options && options.length > 0 ?
                        <Checkbox.Group onChange={(value) => {
                            if (value.length <= 20) {
                                setTags(value);
                            }
                        }} style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}
                            value={tags}>
                            {
                                options.map((value: any, key: any) => {
                                    if (value.text.toUpperCase().indexOf(selectValue.toUpperCase()) > -1) {
                                        return <div title={value.value} key={key} style={{ width: '33%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            <Checkbox style={{ width: 'calc(100% - 20px)', overflow: 'hidden', textOverflow: 'ellipsis' }} name={value.value}>{value.text}</Checkbox>
                                        </div>
                                    }
                                })
                            }
                        </Checkbox.Group> :
                        <Status
                            // @ts-ignore
                            icon={'loading'}
                            // @ts-ignore
                            size={'l'}
                            title={"正在获取App列表..."}
                        />
                }
            </div>
            {/* <TagSelect
                // optionsOnly
                placeholder={getValue('compliance-selectAppDesc')}
                options={options}
                onChange={(tags) =>{ setTags(tags)}}
            /> */}
        </Modal.Body>
        <Modal.Footer>
            <Button type="primary" onClick={() => {
                console.log(tags)
            }}>
                <Localized id={'modal-ok'}></Localized>
            </Button>
            <Button type="weak" onClick={() => { props.setIsShowAddDialog(false) }}>
                <Localized id={'modal-cancel'}></Localized>
            </Button>
        </Modal.Footer>
    </Modal></>
}