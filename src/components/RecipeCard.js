import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Icon, Text } from 'react-native-elements';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth / 2) - 8;

const RecipeCard = ({ item, showHeart = false, onPress }) => {
  const handleHeartPress = () => {
    Alert.alert('Favorito', 'Receita removida dos favoritos!');
  };

  // Support both data structures (title/name, image/imageUrl)
  const title = item.title || item.name || 'Receita sem nome';
  const imageUrl = item.image || item.imageUrl || null;
  const description = item.description || 'Sem descrição';

  return (
    <TouchableOpacity style={[styles.touchable, { width: cardWidth }]} onPress={onPress} activeOpacity={0.8}>
      <Card containerStyle={styles.card}>
        <View>
          {imageUrl && <Card.Image source={{ uri: imageUrl }} style={styles.image} />}
          {showHeart && (
            <TouchableOpacity onPress={handleHeartPress}>
              <Icon
                name="heart"
                type="feather"
                color="red"
                containerStyle={styles.heartIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        <Card.Title>{title}</Card.Title>
        <Text style={styles.description}>{description}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    margin: 0,
    padding: 2,
  },
  card: {
    padding: 0,
    margin: 2,
    marginHorizontal: 2,
    borderRadius: 5,
    position: 'relative',
    elevation: 2,
  },
  image: {
    height: 150,
    width: '100%',
    borderRadius: 5,
  },
  description: {
    padding: 8,
    fontSize: 14,
    color: '#333',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
  },
});

export default RecipeCard;
