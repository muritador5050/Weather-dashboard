import { Spinner, Flex } from '@chakra-ui/react';

export default function Loader() {
  return (
    <Flex py={8} justify='center' align='center'>
      <Spinner size='xl' color='white' />
    </Flex>
  );
}
