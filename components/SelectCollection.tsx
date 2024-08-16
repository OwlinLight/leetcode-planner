'use client'
import {Select, SelectItem} from "@nextui-org/select";
import {fetchCollections} from "@/app/lib/action";
import {useEffect, useState} from "react";
import {store} from "@/app/store";

export default function SelectCollection() {
    const [collections, setCollections] = useState([] as any);
    const [selectedCollectionId, setSelectedCollectionId] = useState<any>(store.selectedCollectionId);

    const handleSelectionChange = (id: any) => {
        setSelectedCollectionId(id);
        store.selectedCollectionId = id;
        console.log(id);
    };

    useEffect(() => {
        async function getCollections() {
            const data: any = await fetchCollections();
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
                defaultSelectedKeys={selectedCollectionId}
                value={selectedCollectionId}
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
