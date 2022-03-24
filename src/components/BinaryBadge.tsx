import { Badge } from "@tencent/tea-component";
import { Localized } from "i18n";
import React from "react";

export const BinaryBadge: React.FC = () => {
    return (
        <Badge style={{ marginLeft: '10px' }}><Localized id='file-category-binary' /></Badge>
    )
}
