import {Input} from "@/common/components/atomic/Input";
import Form from "@/common/components/global/Form";
import {ArrayElement} from "@/common/utils/types";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";
import {FC} from "react";

interface Props {
    media?: ArrayElement<Awaited<ReturnType<typeof mediaLibraryService.getAll>>>
}

const MediaForm: FC<Props> = ({media}) => (
    <Form
        className='flex flex-col gap-3'
        action={media ? '/api/media-library/update' : '/api/media-library/create'}
        template={media ? 'UPDATE' : 'CREATE'}
    >
        {media && <input value={media.id} name='id' className='hidden'/>}
        <Input
            icon='HashtagIcon'
            label='Titre'
            name='title'
            placeholder='Titre'
            initialValue={media?.title}
        />
        <Input
            icon='NewspaperIcon'
            label='Description'
            name='description'
            placeholder='Description'
            type='textarea'
            initialValue={media?.description}
        />
        <Input
            icon='LinkIcon'
            label='Lien'
            name='url'
            placeholder='Lien'
            type='url'
            initialValue={media?.url}
        />
    </Form>
)

export default MediaForm
