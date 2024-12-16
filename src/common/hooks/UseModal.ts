import {useState} from "react";

const UseModal = <T>(acceptsModel: boolean = true): [model: T, isShown: boolean, toggle: (show: boolean, model?: T) => void] => {
    const [isShown, setIsShown] = useState(false)
    if (acceptsModel) {
        const [selectedModel, setSelectedModel] = useState<T>({} as T)
        const toggle = (show: boolean, model?: T) => {
            if (model) setSelectedModel(model)
            setIsShown(show)
        }
        return [selectedModel!, isShown, toggle]
    } else {
        const toggle = (show: boolean) => setIsShown(show)
        return [undefined!, isShown, toggle]
    }
};

export default UseModal