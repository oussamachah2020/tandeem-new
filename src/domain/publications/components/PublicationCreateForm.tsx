import {FC} from "react";
import {Input} from "@/common/components/atomic/Input";
import Button from "@/common/components/atomic/Button";
import {PublicationCreateDto, PublicationCreateFilesDto} from "@/domain/publications/dtos/PublicationCreateDto";

type T = PublicationCreateDto & PublicationCreateFilesDto
const PublicationCreateForm: FC = () =>
    (
        <form action='/api/publications/create' method='post' encType='multipart/form-data'>
            <div className='flex flex-col gap-6'>
                <div className='grid grid-cols-2 gap-4'>
                    <Input<T> icon='HashtagIcon' label='Titre' name='title' placeholder='Titre' className='col-span-2'/>
                    <Input<T>
                        icon='DocumentTextIcon'
                        label='Contenu'
                        name='content'
                        placeholder='Description/Contenu'
                        type='textarea'
                        className='col-span-2'
                    />
                    <Input<T> icon='PhotoIcon' label='Image' name='image' placeholder='Image' type='file'
                              accept='image'/>
                    <Input<T> label='Épinglé' name='pinned' type='checkbox'>
                        Marquer comme épinglé
                    </Input>
                </div>
                <Button icon='PlusIcon' text='Ajouter'/>
            </div>
        </form>
    )

export default PublicationCreateForm
