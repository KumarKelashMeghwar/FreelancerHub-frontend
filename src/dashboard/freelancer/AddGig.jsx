"use client";

import { AuthContext } from "@/context/AuthContext";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  NumberInput,
  Select,
  Stack,
  Tag,
  TagLabel,
  Textarea,
  Text,
  Field,
  NativeSelect,
  Combobox,
  Portal,
  createListCollection,
  Wrap,
  Badge,
  FileUpload,
  Float,
  Image
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { LuFileImage, LuX } from "react-icons/lu";

export default function AddGig() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(5);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  const params = new URLSearchParams(window.location.search);

  let { token, user } = useContext(AuthContext);
  token = token || localStorage.getItem("token");

  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [tagSearchValue, setTagSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.toLowerCase().includes(categorySearchValue.toLowerCase())
      ),
    [categorySearchValue, categories]
  );

  const filteredTags = useMemo(
    () =>
      tags.filter((tag) =>
        tag.toLowerCase().includes(tagSearchValue.toLowerCase())
      ),
    [tagSearchValue, tags]
  );

  const categoryCollection = useMemo(
    () => createListCollection({ items: filteredCategories }),
    [filteredCategories]
  );

  const tagCollection = useMemo(
    () => createListCollection({ items: filteredTags }),
    [filteredTags]
  );

  const handleCategoryValueChange = (details) => {
    setSelectedCategories(details.value);
  };

  const handleTagValueChange = (details) => {
    setSelectedTags(details.value);
  };

  const fetchCategories = async () => {
    const response = await axios.get("http://localhost:8080/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    const categoryNames = response.data.map((n) => n.name);
    setCategories(categoryNames);
    setAllCategories(response.data);
  };

  const fetchTags = async () => {
    const response = await axios.get("http://localhost:8080/api/tags", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    const tagNames = response.data.map((t) => t.name);
    setTags(tagNames);
    setAllTags(response.data);
  };

  const fetchGigById = async (gigId) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/gigs/my-gigs/" + gigId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTitle(response.data.title);
        setDescription(response.data.description);
        setPrice(Number(response.data.price));
        setSelectedTags(response.data.tags);
        setSelectedCategories([response.data.categoryName]);

        // store existing images with id+url
        setExistingImages(
          response.data.images.map((url, index) => ({ id: index, url }))
        );
      }
    } catch (ex) {
      console.error("Error while fetching gig", ex);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();

    if (params.get("edit") === "1") {
      setEditMode(true);
      fetchGigById(params.get("gigId"));
    }
  }, []);

  const handleRemoveExistingImage = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleGigSubmit = async (e) => {
    e.preventDefault();

    const categoryIds = allCategories.filter(
      (cate) => cate.name === selectedCategories[0]
    );
    const mySelectedTags = selectedTags
      .flatMap((st) => allTags.filter((at) => at.name === st))
      .map((at) => at.id);

    const fd = new FormData();
    fd.append("title", title);
    fd.append("price", Number(price));
    fd.append("description", description);
    fd.append("categoryId", categoryIds[0]["id"]);
    mySelectedTags.forEach((tag) => fd.append("tagIds", tag));

    // keep old images that are not removed
    existingImages.forEach((img) => fd.append("existingImages", img.url));

    // add new uploads
    files.forEach((file) => fd.append("images", file));

    try {
      let response;
      if (editMode) {
        const gigId = params.get("gigId");
        fd.append("gigId", gigId);

        response = await axios.put(
          `http://localhost:8080/api/gigs/update/${gigId}`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          alert("Gig updated successfully!");
        } else {
          alert("Failed to update gig");
        }
      } else {
        response = await axios.post("http://localhost:8080/api/gigs/create", fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        if (response.status === 201) {
          alert("Gig created successfully!");
        } else {
          alert("Server error while creating gig!");
        }
      }
    } catch (error) {
      console.error("Error saving gig", error);
      alert("Something went wrong!");
    }
  };

  return (
    <Container maxW="4xl" py={10}>
      <Box
        bg="white"
        p={8}
        rounded="2xl"
        shadow="lg"
        border="1px solid"
        borderColor="gray.100"
      >
        <Heading size="lg" mb={6} textAlign="center">
          {editMode ? "Edit Gig " : "Add New Gig"}
        </Heading>
        <form onSubmit={handleGigSubmit}>
          <Stack spacing={10}>
            {/* Title */}
            <Field.Root>
              <Field.Label>Gig Title</Field.Label>
              <Input
                placeholder="Enter gig title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </Field.Root>

            {/* Description */}
            <Field.Root mt={3} mb={3}>
              <Field.Label>Description</Field.Label>
              <Textarea
                placeholder="Describe your gig..."
                rows={5}
                name="description"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
              />
            </Field.Root>

            <Flex alignItems={"center"} justifyContent={"space-between"}>
              {/* Tags */}
              <Combobox.Root
                openOnChange={(e) => e.inputValue.length >= 2}
                multiple
                closeOnSelect
                width={"320px"}
                value={selectedTags}
                collection={tagCollection}
                onValueChange={handleTagValueChange}
                onInputValueChange={(details) =>
                  setTagSearchValue(details.inputValue)
                }
              >
                <Wrap gap="2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </Wrap>

                <Combobox.Label>Tags</Combobox.Label>

                <Combobox.Control>
                  <Combobox.Input />
                </Combobox.Control>

                <Portal>
                  <Combobox.Positioner>
                    <Combobox.Content>
                      <Combobox.ItemGroup>
                        <Combobox.ItemGroupLabel>Tags</Combobox.ItemGroupLabel>
                        {filteredTags.map((tag) => (
                          <Combobox.Item key={tag} item={tag}>
                            {tag} <Combobox.ItemIndicator />
                          </Combobox.Item>
                        ))}
                        <Combobox.Empty>No tags found</Combobox.Empty>
                      </Combobox.ItemGroup>
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Portal>
              </Combobox.Root>

              {/* Category */}
              <Combobox.Root
                closeOnSelect
                width={"320px"}
                value={selectedCategories}
                collection={categoryCollection}
                onValueChange={handleCategoryValueChange}
                onInputValueChange={(details) =>
                  setCategorySearchValue(details.inputValue)
                }
              >
                <Combobox.Label>Category</Combobox.Label>

                <Combobox.Control>
                  <Combobox.Input />
                  <Combobox.IndicatorGroup>
                    <Combobox.Trigger />
                  </Combobox.IndicatorGroup>
                </Combobox.Control>

                <Portal>
                  <Combobox.Positioner>
                    <Combobox.Content>
                      <Combobox.ItemGroup>
                        <Combobox.ItemGroupLabel>
                          Categories
                        </Combobox.ItemGroupLabel>
                        {filteredCategories.map((category) => (
                          <Combobox.Item key={category} item={category}>
                            {category} <Combobox.ItemIndicator />
                          </Combobox.Item>
                        ))}
                        <Combobox.Empty>No categories found</Combobox.Empty>
                      </Combobox.ItemGroup>
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Portal>
              </Combobox.Root>
            </Flex>

            {/* Price */}
     
            <Field.Root>
              <Field.Label>Price ($)</Field.Label>
              <Input
                min={5}
                max={10000}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
              
              />
            </Field.Root>

            {/* Existing Images Preview */}
            {editMode && existingImages.length > 0 && (
              <Flex gap={4} wrap="wrap">
                {existingImages.map((img) => (
                  <Box key={img.id} position="relative">
                    <Image
                      src={`http://localhost:8080${img.url}`}
                      alt="Gig Image"
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <Button
                      size="xs"
                      colorScheme="red"
                      position="absolute"
                      top="0"
                      right="0"
                      onClick={() => handleRemoveExistingImage(img.id)}
                    >
                      <LuX />
                    </Button>
                  </Box>
                ))}
              </Flex>
            )}

            {/* New Image uploads */}
            <FileUpload.Root maxFiles={3} mb={"3"} mt={"3"}>
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button variant={"outline"} size={"sm"}>
                  <LuFileImage /> Upload Images
                </Button>
              </FileUpload.Trigger>

              <FileUpload.Context>
                {(ctx) => {
                  useEffect(() => {
                    setFiles(ctx.acceptedFiles);
                  }, [ctx.acceptedFiles]);
                  return (
                    <>
                      <FileUpload.ItemGroup
                        as={Flex}
                        flexDirection={"row"}
                        gap={4}
                      >
                        {ctx.acceptedFiles.map((file) => (
                          <FileUpload.Item
                            width={"auto"}
                            boxSize={"20"}
                            p="2"
                            file={file}
                            key={file.name}
                          >
                            <FileUpload.ItemPreviewImage />
                            <Float placement={"top-end"}>
                              <FileUpload.ItemDeleteTrigger
                                boxSize={"4"}
                                layerStyle={"fill.solid"}
                              >
                                <LuX />
                              </FileUpload.ItemDeleteTrigger>
                            </Float>
                          </FileUpload.Item>
                        ))}
                      </FileUpload.ItemGroup>
                      {ctx.rejectedFiles.length > 0 && (
                        <Text color={"red.500"}>
                          You can only upload upto 3 images.
                        </Text>
                      )}
                    </>
                  );
                }}
              </FileUpload.Context>
            </FileUpload.Root>

            {/* Submit */}
            <Button type="submit" colorScheme="blue" size="lg" rounded="xl">
              {editMode ? "Update Gig" : "Submit Gig"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
