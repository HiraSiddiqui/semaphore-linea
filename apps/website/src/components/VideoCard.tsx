import { Heading, Card, CardBody, AspectRatio, HStack } from "@chakra-ui/react"

export type VideoCardProps = {
    embeddedVideoUrl: string
    title: string
}

export default function VideoCard({ embeddedVideoUrl, title }: VideoCardProps) {
    return (
        <Card
            bg={"transparent"}
            borderRadius={"10px"}
            color={"white"}
            width={"297px"}
            height={"375px"}
            _hover={{ bgColor: "darkBlue1" }}
        >
            <HStack borderRadius={"10px 10px 0px 0px"}>
                <AspectRatio width={"297px"} height={"215px"} borderRadius={"10px"} overflow={"hidden"}>
                    <iframe title={title} src={embeddedVideoUrl} allowFullScreen />
                </AspectRatio>
            </HStack>
            <CardBody padding={"0px 20px 20px 20px"}>
                <Heading fontSize={"20px"} lineHeight={"28px"} fontWeight={"normal"}>
                    {title}
                </Heading>
            </CardBody>
        </Card>
    )
}