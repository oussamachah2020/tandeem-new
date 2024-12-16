import {FC} from "react";
import {Input} from "@/common/components/atomic/Input";
import Button from "@/common/components/atomic/Button";
import {PublicationUpdateDto, PublicationUpdateFilesDto} from "@/domain/publications/dtos/PublicationUpdateDto";
import {ArrayElement} from "@/common/utils/types";
import publicationService from "@/domain/publications/services/PublicationService";

interface Props {
    publication: ArrayElement<Awaited<ReturnType<typeof publicationService.getAll>>>
}

type T = PublicationUpdateDto & PublicationUpdateFilesDto
const PublicationCreateForm: FC<Props> = ({publication}) =>
    (
        <form action='/api/publications/update' method='post' encType='multipart/form-data'>
            <input name='id' value={publication.id} className='hidden'/>
            <input name='imageRef' value={publication.photo} className='hidden'/>
            <div className='flex flex-col gap-6'>
                <div className='grid grid-cols-2 gap-4'>
                    <Input<T> icon='HashtagIcon' label='Titre' name='title' placeholder='Titre' className='col-span-2'
                              initialValue={publication.title}/>
                    <Input<T>
                        icon='DocumentTextIcon'
                        label='Contenu'
                        name='content'
                        placeholder='Description/Contenu'
                        type='textarea'
                        className='col-span-2'
                        initialValue={publication.content}
                    />
                    <Input<T> icon='PhotoIcon' label='Image' name='image' placeholder='Image' type='file' accept='image'
                              required={false}/>
                    <Input<T> label='Épinglé' name='pinned' type='checkbox' initialValue={publication.pinned}>
                        Marquer comme épinglé
                    </Input>
                </div>
                <Button icon='PencilSquareIcon' text='Modifier'/>
            </div>
        </form>
    )

export default PublicationCreateForm