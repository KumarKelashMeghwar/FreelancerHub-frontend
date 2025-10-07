import { AuthContext } from '@/context/AuthContext';
import { Box, Button, Container, Field, Flex, Heading, Input, Listbox, Separator, useFilter, useListCollection } from '@chakra-ui/react'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

export const Dashboard = () => {

    const { contains } = useFilter({ sensitivity: "base" });

    const [loading, setLoading] = useState(true);
    const [myCategory, setMyCategory] = useState("");
    const [myTag, setMyTag] = useState("");

    let { token } = useContext(AuthContext);

    token = token || localStorage.getItem("token");

    const { collection: categoryCollection, filter: filterCategories, set: setCategoriesCollection } = useListCollection({
        initialItems: [],
        filter: contains,
    });

    const { collection: tagCollection, filter: filterTags, set: setTagsCollection } = useListCollection({
        initialItems: [],
        filter: contains
    })


    const { register: registerCategory, handleSubmit: handleSubmitCategory, formState: { errors: categoryErrors } } = useForm();

    const {register: registerTag, handleSubmit: handleSubmitTag, formState:{errors: tagErrors}} = useForm();

    const fetchCategories = async () => {

        try {
            const response = await axios.get("http://localhost:8080/api/categories", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            let modifiedItems = response.data.map((it) => ({
                label: it.name,
                value: String(it.name).toLowerCase(),
            }));

            setCategoriesCollection(modifiedItems);
        } catch (err) {
            console.error("Erro fetching categories ", err);
        } finally {
            setLoading(false);
        }
    }

    const fetchTags = async () => {
        const response = await axios.get("http://localhost:8080/api/tags", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });

        let modifiedTagItems = response.data.map((it) => ({
            label: it.name,
            value: it.name
        }));

        setTagsCollection(modifiedTagItems);
    }



    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, []);


    const handleCategorySubmit = async () => {

        try {
            await axios.post("http://localhost:8080/api/admin/add-category", {
                name: myCategory.charAt(0).toUpperCase() + myCategory.slice(1)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            window.location.reload();

        } catch (error) {
            console.error("Error while adding a category ", error);
        }
    }

    const handleTagSubmit = async () => {
        try {
            await axios.post("http://localhost:8080/api/admin/add-tag", {
                name: myTag.toLowerCase()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
            window.location.reload()
        } catch (error) {
            console.error("Error while posting a tag", error);
        }
    }


    return (
        <Container>
            <Box>
                <Heading>Add Category</Heading>

                <Flex justify={"space-between"} marginTop={"1rem"}>
                    <Box width={"40%"}>
                        <form onSubmit={handleSubmitCategory(handleCategorySubmit)}>
                            <Box spaceY={"4"}>
                                <Field.Root required invalid={!!categoryErrors.category} >
                                    <Field.Label>Category <Field.RequiredIndicator /> </Field.Label>
                                    <Input
                                        type='text'
                                        placeholder='category name'
                                        {...registerCategory("category", {
                                            required: "Category name is required", minLength: {
                                                value: 3,
                                                message: "Category must be atleast 3 characters long"
                                            }
                                        })}
                                        value={myCategory}
                                        onChange={(e) => setMyCategory(e.currentTarget.value)}
                                    />
                                    <Field.ErrorText>{categoryErrors.category?.message}</Field.ErrorText>
                                </Field.Root>

                                <Button type='submit' >
                                    Submit
                                </Button>
                            </Box>
                        </form>
                    </Box>

                    <Box width={"50%"}>
                        {loading ? (<Heading>Loading Categories</Heading>) : (
                            <Listbox.Root maxW={"100%"} collection={categoryCollection}>
                                <Listbox.Label>Available Categories</Listbox.Label>
                                <Listbox.Input as={Input}
                                    placeholder='Find existing categories'
                                    onChange={(e) => filterCategories(e.target.value)}
                                />
                                <Listbox.Content maxH={"150px"}>
                                    {categoryCollection.items.map((category) => (
                                        <Listbox.Item item={category} key={category.value}>
                                            <Listbox.ItemText>{category.label}</Listbox.ItemText>
                                            <Listbox.ItemIndicator />
                                        </Listbox.Item>
                                    ))}

                                    <Listbox.Empty>No categories found</Listbox.Empty>
                                </Listbox.Content>


                            </Listbox.Root>
                        )}
                    </Box>

                </Flex>
            </Box>

            <Separator size={"md"} margin={"1rem 0"} />

            <Box>
                <Heading>Add Tag</Heading>
                <Flex justify={"space-between"} marginTop={"1rem"}>
                    <Box width={"40%"}>
                        <form onSubmit={handleSubmitTag(handleTagSubmit)}>
                            <Box spaceY={"4"}>
                                <Field.Root required invalid={!!tagErrors.tag}>
                                    <Field.Label>Tag <Field.RequiredIndicator /></Field.Label>
                                    <Input 
                                    type='text'
                                    placeholder='add tag'
                                    {...registerTag("tag", {
                                        required: "tag is required",
                                        minLength: {
                                            value: 3,
                                            message: "Tag should be 3 characters long."
                                        }
                                    })}
                                    value={myTag}
                                    onChange={(e) => setMyTag(e.currentTarget.value)}
                                    />
                                    <Field.ErrorText>{tagErrors.tag?.message}</Field.ErrorText>
                                </Field.Root>

                                <Button type='submit' >
                                    Submit
                                </Button>
                            </Box>
                        </form>
                    </Box>
                    <Box width={"50%"}>
                        <Listbox.Root maxW={"100%"} collection={tagCollection}>
                            <Listbox.Label>Available Tags</Listbox.Label>
                            <Listbox.Input as={Input}
                                placeholder='Find existing tags'
                                onChange={(e) => filterTags(e.target.value)}
                            />
                            <Listbox.Content maxH={"150px"}>
                                {tagCollection.items.map((category) => (
                                    <Listbox.Item item={category} key={category.value}>
                                        <Listbox.ItemText>{category.label}</Listbox.ItemText>
                                        <Listbox.ItemIndicator />
                                    </Listbox.Item>
                                ))}

                                <Listbox.Empty>No tags found</Listbox.Empty>
                            </Listbox.Content>


                        </Listbox.Root>
                    </Box>
                </Flex>
            </Box>
        </Container>
    )
}

