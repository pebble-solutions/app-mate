export type VariableType = {
    _id: string,
    label: string,
    description?: string,
    start?: Date,
    end?: Date,
    question: string,
    type: string,
    example?: null,
    min_value?: null,
    max_value?: null,
    default_value?: null,
    internal_description?: null,
    min_length?: null,
    max_length?: null,
    file_upload_guide?: null,
    file_upload_enabled?: null,
    file_upload_required?: null,
    comment_guide?: null,
    comment_enabled?: null,
    comment_required?: null,
    ref_in?: null,
    ref_out?: null,
    list_params?: null,
    interval?: null,
    isActive: boolean,
    mandatory?: boolean,
}

export type ActivityVariableType = Omit<VariableType, "_id"> & {
    variable_id: string
}

export type VariableValueType = Date | string | number | boolean | null