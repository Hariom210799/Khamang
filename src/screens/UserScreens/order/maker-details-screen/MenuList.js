import React from 'react';
import {FlatList, SafeAreaView} from 'react-native';

export default function VirtualizedView(props) {
  console.log('PROPS:', props);
  return (
    <SafeAreaView>
      <FlatList
        data={props.data}
        ListEmptyComponent={null}
        keyExtractor={() => 'dummy'}
        renderItem={() => <Text>Jayesh</Text>}
        ListHeaderComponent={() => (
          <React.Fragment>{props.children}</React.Fragment>
        )}
      />
    </SafeAreaView>
  );
}
