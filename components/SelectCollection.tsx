'use client'
import {Select, SelectSection, SelectItem} from "@nextui-org/select";
import {fetchCollections} from "@/app/lib/action";
import {useEffect, useState} from "react";
import {store} from "@/app/store";

export default function SelectCollection() {
    const [collections, setCollections] = useState([] as any);
    const [selectedCollection, setSelectedCollection] = useState<any>(store.selectedCollection);

    const handleSelectionChange = (collection: any) => {
        setSelectedCollection(collection);
        store.selectedCollection = collection;
        console.log(collection);
    };

    useEffect(() => {
        async function getCollections() {
            const data = await fetchCollections();
            setCollections(data);
        }
        getCollections();
        console.log(collections);
    }, [])

    return (
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Select
                label="Selected collection"
                placeholder="selected collection"
                className="max-w-xs"
                defaultSelectedKeys={selectedCollection}
                value={selectedCollection}
                onChange={e => handleSelectionChange(e.target.value)}
            >
                {collections.map((collection: any) => (
                    <SelectItem key={collection.id}>
                        {collection.name}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );


}
