// declaring type
export type Paper = {
    id: string;
    submitter: string;
    authors: string;
    title: string;
    comments: string;
    journal_ref: string;
    doi: string;
    report_no: string;
    categories: string;
    license: string;
    abstract: string;
    versions: Array<{
        version: string;
        created: string;
    }>;
    update_date: string;
    authors_parsed: Array<Array<string>>;
};